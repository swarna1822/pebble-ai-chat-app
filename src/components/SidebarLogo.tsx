import { Box, Divider, Typography } from "@mui/material"

import logo from '../Assets/Gradient Pebble Chat Assistant Icon.png'


const SidebarLogo = ()=>{
    return (
        <Box sx={{display:'flex', alignItems:'center'}}>
            <Box>
                <img style={{height:'50px', width:'50px'}} src={logo} alt="logo"/>
            </Box>
            <Box>
                <Typography>Pebble</Typography>
                <Typography variant="body2">AI sssistant</Typography>
            </Box>
            <Divider/>
        </Box>
    )
}

export default SidebarLogo