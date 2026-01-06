using System.Net;
using System.Text.Json;

namespace CapStoneAPI.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ApplicationException ex)
        {
            await HandleException(context, ex.Message, HttpStatusCode.BadRequest);
        }
        catch (Exception)
        {
            await HandleException(context, "An unexpected error occurred",
                HttpStatusCode.InternalServerError);
        }
    }

    private static async Task HandleException(
        HttpContext context, string message, HttpStatusCode code)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        var response = new
        {
            statusCode = context.Response.StatusCode,
            message
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
