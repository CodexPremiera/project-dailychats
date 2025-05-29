"use client"

import React, {useEffect, useRef} from 'react';
import { User } from "@supabase/supabase-js";
import {useUser} from "@/lib/store/user";

interface Props{
  user: User | undefined;
}

function InitUser( {user} : Props ) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUser.setState(user);
    }

    initState.current = true;
  }, []);

  return (
    <></>
  );
}

export default InitUser;