import axios from "axios";

export const imageUpload = async (images) => {
    let imgURL = '';
    const formData = new FormData()
    formData.append("file", images)
    
    formData.append("upload_preset", "htnuhtr1")
    formData.append("cloud_name", "kogleo")

    // const res = await fetch("https://res.cloudinary.com/kogleo/image/upload", {
    //     method: "POST",
    //     body: formData
    // })
    await axios.post("https://api.cloudinary.com/v1_1/kogleo/image/upload", formData).then((res)=>{
        imgURL = (res.data.url)
    })
    // const data = await res.json()
    // imgArr.push({public_id: data.public_id, url: data.secure_url})

    // return imgArr;
    return imgURL
}