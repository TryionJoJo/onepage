
interface Env {
  APEX_DB: any;
}

export const onRequestDelete = async (context: any) => {
  try {
    const id = context.params.id;
    
    const value = await context.env.APEX_DB.get("articles");
    let articles = value ? JSON.parse(value) : [];
    
    // Filter out the article
    articles = articles.filter((a: any) => a.id !== id);
    
    await context.env.APEX_DB.put("articles", JSON.stringify(articles));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response("Error deleting article", { status: 500 });
  }
}
