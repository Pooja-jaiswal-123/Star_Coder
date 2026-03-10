"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/lib/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

const Provider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Database mein check aur insert karne ka logic alag function mein nikal liya
    const handleUserSession = async (loggedUser) => {
      if (!loggedUser) return;

      console.log("Logged in user →", loggedUser.email);

      // Pehle check karo user DB mein hai ya nahi
      let { data: Users, error: fetchError } = await supabase
        .from("Users")
        .select("*")
        .eq("email", loggedUser.email);

      if (fetchError) {
        console.error("Error fetching user:", fetchError);
        return;
      }

      // Agar user DB mein nahi hai, toh naya create karo
      if (!Users || Users.length === 0) {
        const { data, error: insertError } = await supabase
          .from("Users")
          .insert([
            {
              name: loggedUser.user_metadata?.full_name || loggedUser.user_metadata?.name || "",
              email: loggedUser.email,
              picture: loggedUser.user_metadata?.avatar_url || "",
              credits: 10,
            },
          ])
          .select(); // .select() zaroori hai naya data wapas paane ke liye

        if (insertError) {
          console.error("Error inserting user:", insertError);
        } else {
          console.log("User created:", data);
          setUser(data?.[0] || null); // Naya user state mein set karo
        }
      } else {
        console.log("User already exists:", Users[0]);
        setUser(Users[0]); // Existing user state mein set karo
      }
    };

    // 1. Initial Load par check karo (Agar user pehle se logged in hai)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user);
      }
    });

    // 2. Auth State Listener (Login/Logout detect karne ke liye)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth Event Triggered:", event);
        
        if (event === "SIGNED_IN") {
          // Jaise hi login complete hoga, yeh function apne aap chalega
          handleUserSession(session?.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // Cleanup taaki memory leak na ho
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
};

export default Provider;

// Hook
export const useUser = () => {
  const context = useContext(UserDetailContext);
  return context;
};