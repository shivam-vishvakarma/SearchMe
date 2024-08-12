export default async (req, context)=>{
    let word = new URL(req.url).searchParams.get('word');
    let res = await fetch(`https://dictionary-by-api-ninjas.p.rapidapi.com/v1/dictionary?word=${word}`, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': Netlify.env.get("API_KEY"),
            'x-rapidapi-host': 'dictionary-by-api-ninjas.p.rapidapi.com'
        }
    })
    let data = await res.json();
    // console.log("context",context)
    return new Response(JSON.stringify(data));
}