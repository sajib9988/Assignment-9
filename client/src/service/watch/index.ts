"use server"


export const hasPaidForMedia =async ()=>{
try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/watch/access/:mediaId`,

    ) 
    return res;
}
catch (error) {
    console.error('Error checking media payment status:', error);
    return false;
}
}