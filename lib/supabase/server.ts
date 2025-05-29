"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {Database} from "@/database.types";

export const supabaseServer = async () => {
	const cookieStore = await cookies(); // ✅ async-safe

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
			},
		}
	);
};
