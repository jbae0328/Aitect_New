// Models/WorkspaceModels.cs
namespace Aitect_pilot.Models
{
    // 도구 관련 모델
    public class Tool
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public bool IsActive { get; set; } = false;
        public string Description { get; set; } = "";
    }

    // 도구 변형 모델
    public class ToolVariant
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public bool IsActive { get; set; } = false;
        public string Description { get; set; } = "";
    }

    // 빠른 설정 모델
    public class QuickSetting
    {
        public string Key { get; set; } = "";
        public string Label { get; set; } = "";
        public string Value { get; set; } = "";
        public string InputType { get; set; } = "text"; // text, number, range, color 등
        public string Unit { get; set; } = "";
    }

    // 매스 스터디 옵션 모델
    public class MassOption
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public int Efficiency { get; set; } = 0;
        public bool IsSelected { get; set; } = false;
        public string Description { get; set; } = "";
    }

    // 분석 데이터 모델
    public class AnalysisData
    {
        public int VolumeRatio { get; set; } = 240;
        public int Efficiency { get; set; } = 85;
        public string Status { get; set; } = "Good";
    }

    // 객체 속성 모델
    public class ObjectProperties
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Type { get; set; } = "";
        public string Icon { get; set; } = "";
        public List<Property> BasicProperties { get; set; } = new();
        public List<Property> GeometryProperties { get; set; } = new();
        public List<Property> MaterialProperties { get; set; } = new();
    }

    // 속성 모델
    public class Property
    {
        public string Key { get; set; } = "";
        public string Label { get; set; } = "";
        public string Value { get; set; } = "";
        public string Type { get; set; } = "text"; // text, number, color, toggle, select, material
        public string Unit { get; set; } = "";
        public bool IsReadOnly { get; set; } = false;
        public List<PropertyOption> Options { get; set; } = new();
    }

    // 속성 옵션 모델 (select 타입용)
    public class PropertyOption
    {
        public string Label { get; set; } = "";
        public string Value { get; set; } = "";
    }

    // 속성 변경 이벤트 인자
    public class PropertyChangedArgs
    {
        public string Key { get; set; } = "";
        public string Value { get; set; } = "";
    }
}