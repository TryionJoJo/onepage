
interface Env {
  APEX_DB: any; // KVNamespace
}

export const onRequestGet = async (context: any) => {
  try {
    const value = await context.env.APEX_DB.get("articles");
    const articles = value ? JSON.parse(value) : [];
    return new Response(JSON.stringify(articles), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("KV Error:", err);
    return new Response(JSON.stringify([]), { 
      headers: { "Content-Type": "application/json" } 
    });
  }
}

export const onRequestPost = async (context: any) => {
  try {
    const newArticle = await context.request.json();
    
    // Get existing articles
    const value = await context.env.APEX_DB.get("articles");
    let articles = value ? JSON.parse(value) : [];
    
    // Update existing or add new
    const index = articles.findIndex((a: any) => a.id === newArticle.id);
    if (index > -1) {
      articles[index] = newArticle;
    } else {
      articles.unshift(newArticle);
    }
    
    // Save back to KV
    await context.env.APEX_DB.put("articles", JSON.stringify(articles));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Save Error:", err);
    return new Response("Error saving article", { status: 500 });
  }
}
