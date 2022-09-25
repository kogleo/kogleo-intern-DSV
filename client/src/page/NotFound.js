import { Typography, Box } from "@mui/material"
import { Link } from "react-router-dom"
import notfound from "../assets/img/notfound.png"
import { useEffect } from "react"

export default function NotFound(){
    useEffect(() => {
        document.title="Not found 404"
    }, [])
    return(
        <Box classname="Not Found" marginTop={5}>
            <Typography variant="h3" textAlign="center">Sorry, this page isn't available.</Typography>
            <br/>
            <Typography variant="body1" textAlign="center" >The link you followed may be broken, or the page may have been removed. <Link to={"/"} style={{textDecoration: "none"}}>Go back to Kogleo.</Link></Typography>
            <img src={notfound} alt="not-found" style={{position: "relative", left: "50%", transform: "translateX(-50%)", top: "5vh"}}/>
        </Box>
    )
}