import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("notification error", error);
      return { success: false, msg: "something went wrong" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("postLike error", error);
    return { success: false, msg: "something went wrong" };
  }
};

