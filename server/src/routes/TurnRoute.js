const express= requires("express")
const router= express.router()

router.get('/api/turn-credentials',async(req,res)=>{
    try{
    const response= await fetch(
      `https://${process.env.METERED_APP_NAME}.metered.live/api/v1/turn/credentials?apiKey=${process.env.METERED_API_KEY}`
    );

    if(!response.ok){
        throw new Error("failed to fetch turn credentials${response.status}")
    }
    const iceServers= await response.json()
    res.json(iceServers)

}catch(err){
    console.error("Error fetching turn credentials:", err);
    res.status(500).json({ error: "Failed to fetch turn credentials" });
}
})

export default router