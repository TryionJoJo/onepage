
interface Env {
  APEX_DB: any;
}

export const onRequestPost = async (context: any) => {
  try {
    const { username, password } = await context.request.json();
    
    // Get stored password from KV, default to 'admin' if not set
    const storedPassword = await context.env.APEX_DB.get("admin_password") || "admin";
    
    if (username === "admin" && password === storedPassword) {
      const user = { 
        id: '1', 
        username: '管理员', 
        role: 'ADMIN', 
        avatar: 'https://picsum.photos/id/64/100/100' 
      };
      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response("Invalid credentials", { status: 401 });
  } catch (err) {
    return new Response("Auth Error", { status: 500 });
  }
}
