import { Avatar, Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

const Notes = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get("https://api.gyanibooks.com/library/get_dummy_notes")
            .then((response) => {
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
                        <Grid item xs={12} sm={6} md={4} lg={3} sx={{py: 4}}>
                            <Card key={id} className="card" >
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="user" sx={{border: "1.8px solid black", color:"black", bgcolor: "#FBFBFB"}}>
                                            {item.user}
                                        </Avatar>
                                    }
                                    title={
                                        <Typography variant="h6" className="title">{item.title}</Typography>
                                    }
                                    subheader={`ID: ${item.id}`}
                                />
                                <hr/>
                                <CardContent className="card-content" sx={{px: 3}}>
                                    <details>
                                        <summary>Notes</summary>
                                        <p>
                                    <Typography variant="body2" color="text.secondary">
                                        <ul>
                                            {parseNotesContent(item.notes)?.map((note, index) => (
                                                <li
                                                    key={index}
                                                    style={{
                                                        color: note.textColor !== 'default' ? note.textColor : undefined,
                                                        backgroundColor: note.backgroundColor !== 'default' ? note.backgroundColor : undefined,
                                                    }}
                                                >
                                                    {note.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </Typography>
                                    </p>
                                    </details>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    )
}

export default Notes;