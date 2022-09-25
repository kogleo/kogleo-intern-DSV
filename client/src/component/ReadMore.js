import React, { useState } from "react";
import { Typography } from "@mui/material";

const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
      <Typography variant="body1" className="text" textAlign={'justify'}>
        {isReadMore ? text.slice(0, 200) : text}
        <span onClick={toggleReadMore} style={{cursor: "pointer", color: '#acacac'}} className="read-or-hide">
          {isReadMore ? <b>...read more</b> : <b>&nbsp; show less</b>}
        </span>
      </Typography>
    );
  };

export default ReadMore