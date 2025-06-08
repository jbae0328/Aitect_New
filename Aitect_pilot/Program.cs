// Program.cs�� �߰��� ����

using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Aitect_pilot;
using Aitect_pilot.Services; // �߰�

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// WorkspaceService ��� �߰�
builder.Services.AddScoped<IWorkspaceService, WorkspaceService>();

await builder.Build().RunAsync();