
interface Env {
  APEX_DB: any;
}

export const onRequestPost = async (context: any) => {
  try {
    const { username, password } = await context.request.json();
   const inputPassword = (password || "").normalize('NFKC').trim(); 
    // Get stored password from KV, default to 'admin' if not set
    let storedPassword = await context.env.APEX_DB.get("admin_password") || "admin";
    storedPassword = storedPassword.normalize('NFKC');
    if (username === "admin" && inputPassword === storedPassword) {
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
  } catch (err: any) {
    return new Response("Auth Error", { status: 500 });
   //const availableEnv = context.env ? Object.keys(context.env).join(', ') : 'env is null';
  
  //return new Response(`Debug Error: APEX_DB is missing. Available vars: [${availableEnv}]. Error detail: ${err.message}`, { status: 500 });
  }
}
