
interface Env {
  APEX_DB: any;
}

export const onRequestPost = async (context: any) => {
  try {
    const { oldPassword, newPassword } = await context.request.json();
    
    const currentPassword = await context.env.APEX_DB.get("admin_password") || "admin";
    
    if (oldPassword === currentPassword) {
      await context.env.APEX_DB.put("admin_password", newPassword);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response("Invalid current password", { status: 401 });
  } catch (err) {
    return new Response("Error changing password", { status: 500 });
  }
}
