"use client";
import React, { useEffect } from "react";
import axios from "axios";

function page() {
    useEffect(() => {
        const getData = async () => {
            await axios
                .post("https://budgetbuddy-backend-next.vercel.app/api/login", {
                    email: "swami@jagat.com",
                    password: "Radha",
                })
                .then((res) => console.log(res))
                .catch((error) => console.log(error));
        };
        getData();
    }, []);

    return <div>page</div>;
}

export default page;
