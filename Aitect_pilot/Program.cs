// Program.cs에 추가할 내용

using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Aitect_pilot;
using Aitect_pilot.Services; // 추가

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// WorkspaceService 등록 추가
builder.Services.AddScoped<IWorkspaceService, WorkspaceService>();

await builder.Build().RunAsync();