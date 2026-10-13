using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var utc = new ValueConverter<DateTime, DateTime>(
            v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
        var utcNullable = new ValueConverter<DateTime?, DateTime?>(
            v => v, v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);

        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("Users");
            e.HasKey(u => u.Id);
            e.Property(u => u.Name).IsRequired().HasMaxLength(80);
            e.Property(u => u.Email).IsRequired().HasMaxLength(254);
            e.Property(u => u.PasswordHash).IsRequired().HasMaxLength(100);
            e.Property(u => u.CreatedAt).HasConversion(utc);
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<TaskItem>(e =>
        {
            e.ToTable("Tasks");
            e.HasKey(t => t.Id);

            e.Property(t => t.Title).IsRequired().HasMaxLength(120);
            e.Property(t => t.Description).HasMaxLength(1000);

            e.Property(t => t.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(t => t.Priority).HasConversion<string>().HasMaxLength(20);

            e.Property(t => t.CreatedAt).HasConversion(utc);
            e.Property(t => t.UpdatedAt).HasConversion(utc);
            e.Property(t => t.CompletedAt).HasConversion(utcNullable);

            e.HasIndex(t => t.Status);

            e.HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(t => t.UserId);
        });

        
    }
}