import { Avatar, Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from "@mui/material";
import axios from "axios";
import  { useState, useEffect } from "react";

const Notes = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get("https://api.gyanibooks.com/library/get_dummy_notes")
            .then((response) => {
                console.log(response.data);
                setData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
                setIsLoading(false);
            });
    }, [])

    const parseNotesContent = (notes) => {
        try {
            const parsedContent = JSON.parse(notes);
            if (parsedContent && parsedContent.content) {
                const content = parsedContent.content;
                const extractedContent = [];
                content.forEach((blockGroup) => {
                    if (blockGroup.content) {
                        blockGroup.content.forEach((blockContainer) => {
                            if (blockContainer.content) {
                                blockContainer.content.forEach((block) => {
                                    if (block.content && block.content[0]?.text) {
                                        const textColor = block.attrs?.textColor || 'default';
                                        const backgroundColor = block.attrs?.backgroundColor || 'default';
                                        extractedContent.push({
                                            text: block.content[0].text,
                                            textColor,
                                            backgroundColor,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                return extractedContent;
            }
        } catch (error) {
            console.error('Error parsing notes content:', error);
        }
        return null;
    };



    return (
        <div className="content">
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {data.map((item, id) => (
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            {/* <Typography variant="p">ID: {item.id}</Typography> */}
                            <Card key={id}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="user" className="avatar">
                                            {item.user}
                                        </Avatar>
                                    }
                                    // action={
                                    //     <IconButton aria-label="settings">
                                    //         <MoreVertIcon />
                                    //     </IconButton>
                                    // }
                                    title={
                                        <Typography variant="h6" className="title">{item.title}</Typography>
                                    }
                                    subheader={`ID: ${item.id}`}
                                />
                                <Typography variant="p">Content: {parseNotesContent(item.content)}</Typography>

                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    )
}

export default Notes;