const defaultSkyboxes = [
    {
        subtype: 'Test',
        name: 'Weird Space Test',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/Test/Weird+Space/preview.jpg`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/Test/Weird+Space/1.jpg`,
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/Test/Weird+Space/2.jpg`,
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/Test/Weird+Space/3.jpg`,
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/Test/Weird+Space/4.jpg`,
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/Test/Weird+Space/5.jpg`,
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/Test/Weird+Space/6.jpg`
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Cartoon Base BlueSky',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_2_Left%2BX.png`,   // negX
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_3_Right-X.png`,  // posX
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_4_Up%2BY.png`,    // posY
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_5_Down-Y.png`,    // negY
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_0_Front%2BZ.png`, // posZ
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_1_Back-Z.png`     // negZ
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_4_Up%2BY.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+BlueSky/Sky_Day_BlueSky_Nothing_Cam_5_Down-Y.png`,
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Cartoon Base NightSky',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_2_Left%2BX.png`,   // negX (left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_3_Right-X.png`,    // posX (right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_4_Up%2BY.png`,       // posY (up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_5_Down-Y.png`,     // negY (down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_0_Front%2BZ.png`,  // posZ (front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_1_Back-Z.png`      // negZ (back)
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon+Base+NightSky_Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon Base NightSky_Cam_4_Up+Y.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cartoon+Base+NightSky/Cartoon Base NightSky_Cam_5_Down-Y.png`
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Cold Night',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold+Night__Cam_2_Left%2BX.png`,    // 2 (Left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_3_Right-X.png`,   // 3 (Right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold+Night__Cam_4_Up%2BY.png`,      // 4 (Up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_5_Down-Y.png`,    // 5 (Down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold+Night__Cam_0_Front%2BZ.png`,   // 0 (Front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_1_Back-Z.png`     // 1 (Back)
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_0_Front+Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_2_Left+X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_4_Up+Y.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Night/Cold Night__Cam_5_Down-Y.png`,
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Cold Sunset',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_2_Left%2BX.png`,   // 2 (Left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_3_Right-X.png`,    // 3 (Right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_4_Up%2BY.png`,     // 4 (Up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_5_Down-Y.png`,     // 5 (Down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_0_Front%2BZ.png`,  // 0 (Front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_1_Back-Z.png`      // 1 (Back)
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_4_Up%2BY.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Cold+Sunset/Cold+Sunset__Cam_5_Down-Y.png`
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Deep Dusk',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_2_Left%2BX.png`,   // 2 (Left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_3_Right-X.png`,    // 3 (Right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_4_Up%2BY.png`,     // 4 (Up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_5_Down-Y.png`,     // 5 (Down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_0_Front%2BZ.png`,  // 0 (Front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_1_Back-Z.png`      // 1 (Back)
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_4_Up%2BY.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Deep+Dusk/Deep+Dusk__Cam_5_Down-Y.png`
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Epic_BlueSunset',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_2_Left%2BX.png`,   // 2 (Left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_3_Right-X.png`,    // 3 (Right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_4_Up%2BY.png`,     // 4 (Up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_5_Down-Y.png`,     // 5 (Down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_0_Front%2BZ.png`,  // 0 (Front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_1_Back-Z.png`      // 1 (Back)
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_4_Up%2BY.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_BlueSunset/Epic_BlueSunset_Cam_5_Down-Y.png`
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Epic_GloriousPink',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_2_Left%2BX.png`,   // 2 (Left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_3_Right-X.png`,    // 3 (Right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_4_Up%2BY.png`,     // 4 (Up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_5_Down-Y.png`,     // 5 (Down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_0_Front%2BZ.png`,  // 0 (Front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_1_Back-Z.png`      // 1 (Back)
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_4_Up%2BY.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Epic_GloriousPink/Epic_GloriousPink_Cam_5_Down-Y.png`
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Night MoonBurst',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_2_Left%2BX.png`,   // 2 (Left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_3_Right-X.png`,    // 3 (Right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_4_Up%2BY.png`,     // 4 (Up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_5_Down-Y.png`,     // 5 (Down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_0_Front%2BZ.png`,  // 0 (Front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_1_Back-Z.png`      // 1 (Back)
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_4_Up%2BY.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Night+MoonBurst/Night+Moon+Burst_Cam_5_Down-Y.png`
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Overcast Low',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_2_Left%2BX.png`,   // 2 (Left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_3_Right-X.png`,    // 3 (Right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_4_Up%2BY.png`,     // 4 (Up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_5_Down-Y.png`,     // 5 (Down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_0_Front%2BZ.png`,  // 0 (Front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_1_Back-Z.png`      // 1 (Back)
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_4_Up%2BY.png`,
            // `${process.env.NEXT_PUBLIC_CDN}https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/AllSkyFree/Overcast+Low/Sky_AllSky_Overcast4_Low_Cam_5_Down-Y.png`
        ],
    },
    {
        subtype: 'AllSkyFree',
        name: 'Space_AnotherPlanet',
        preview: `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/preview.png`,
        images: [
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_2_Left%2BX.png`,   // 2 (Left)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_3_Right-X.png`,    // 3 (Right)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_4_Up%2BY.png`,     // 4 (Up)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_5_Down-Y.png`,     // 5 (Down)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_0_Front%2BZ.png`,  // 0 (Front)
            `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_1_Back-Z.png`      // 1 (Back)
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_0_Front%2BZ.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_1_Back-Z.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_2_Left%2BX.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_3_Right-X.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_4_Up%2BY.png`,
            // `${process.env.NEXT_PUBLIC_CDN}games/Epcot/Skyboxes/AllSkyFree/Space_AnotherPlanet/AllSky_Space_AnotherPlanet_Cam_5_Down-Y.png`
        ],
    },
]

export default defaultSkyboxes