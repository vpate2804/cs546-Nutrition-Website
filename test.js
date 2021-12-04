const ref=require("./data");
const reviewData=ref.review;
try{
    let res=reviewData.create(
        "6176241f58c727dc2438f233",
        "6176241f58c727dc2438f234",
        2,
        "2nd review"
    );
    console.log(res);
}catch(e)
{
    console.log(e);
}