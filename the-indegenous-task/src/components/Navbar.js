import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar=()=>{
    return(
        <>
        <AppBar position="static" sx={{bgcolor:"white", color:"black" }}>
            <Toolbar>
                <Typography variant="h4" color="inherit">Notes</Typography>
            </Toolbar>
        </AppBar>
        </>
    )
}

export default Navbar;