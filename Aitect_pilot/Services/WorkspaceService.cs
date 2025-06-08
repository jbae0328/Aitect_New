// Services/IWorkspaceService.cs
using Aitect_pilot.Models;

namespace Aitect_pilot.Services
{
    public interface IWorkspaceService
    {
        List<Tool> Get2DTools();
        List<Tool> Get3DTools();
        List<MassOption> GetMassOptions();
        AnalysisData GetAnalysisData();
    }

    public class WorkspaceService : IWorkspaceService
    {
        public List<Tool> Get2DTools()
        {
            return new List<Tool>
            {
                new() { Id = "select", Name = "Select", Icon = "📍", IsActive = true },
                new() { Id = "line", Name = "Line", Icon = "📏", IsActive = false },
                new() { Id = "rectangle", Name = "Rectangle", Icon = "⬜", IsActive = false },
                new() { Id = "circle", Name = "Circle", Icon = "⭕", IsActive = false },
                new() { Id = "text", Name = "Text", Icon = "📝", IsActive = false }
            };
        }

        public List<Tool> Get3DTools()
        {
            return new List<Tool>
            {
                new() { Id = "select", Name = "Select", Icon = "📍", IsActive = true },
                new() { Id = "line", Name = "Line", Icon = "📏", IsActive = false },
                new() { Id = "box", Name = "Box", Icon = "📦", IsActive = false },
                new() { Id = "cylinder", Name = "Cylinder", Icon = "🥫", IsActive = false },
                new() { Id = "sphere", Name = "Sphere", Icon = "⚽", IsActive = false }
            };
        }

        public List<MassOption> GetMassOptions()
        {
            return new List<MassOption>
            {
                new()
                {
                    Id = "mass-a",
                    Name = "세장형 매스",
                    Icon = "📦",
                    Efficiency = 85,
                    IsSelected = true,
                    Description = "효율적인 세장형 구조"
                },
                new()
                {
                    Id = "mass-b",
                    Name = "정방형 매스",
                    Icon = "🏢",
                    Efficiency = 92,
                    IsSelected = false,
                    Description = "공간 활용도가 높은 정방형 구조"
                },
                new()
                {
                    Id = "mass-c",
                    Name = "복합형 매스",
                    Icon = "🏗️",
                    Efficiency = 78,
                    IsSelected = false,
                    Description = "다양한 기능을 수용하는 복합 구조"
                }
            };
        }

        public AnalysisData GetAnalysisData()
        {
            return new AnalysisData
            {
                VolumeRatio = 240,
                Efficiency = 85,
                Status = "Good"
            };
        }
    }
}