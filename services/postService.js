import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

/**
 * Creates or updates a post in the Supabase database.
 * If the post includes a file (image/video), it uploads it first.
 */
export const createOrUpadtePost = async (post) => {
  try {
    // Upload media file if present and is a file object
    if (post.file && typeof post.file == "object") {
      let isImage = post.file.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) post.file = fileResult.data;
      else {
        // Return early if file upload failed
        return fileResult;
      }
    }

    // Upsert post (insert or update if it exists)
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("crate post error", error);
      return { success: false, msg: "could not create your post" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("crate post error", error);
    return { success: false, msg: "could not create your post" };
  }
};

/**
 * Fetches a list of posts from Supabase.
 * Optionally filters by userId.
 */
export const fetchPosts = async (limit = 10, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*, user: users (id,  name, image), postLikes(*), comments (count)`
        )
        .order("created_at", { ascending: false })
        .eq("userId", userId)
        .limit(limit);

      if (error) {
        console.log("fetch post error", error);
        return { success: false, msg: "could not fetch the posts" };
      }

      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*, user: users (id,  name, image), postLikes(*), comments (count)`
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.log("fetch post error", error);
        return { success: false, msg: "could not fetch the posts" };
      }

      return { success: true, data: data };
    }
  } catch (error) {
    console.log("fetch post error", error);
    return { success: false, msg: "could not fetch the posts" };
  }
};

/**
 * Fetches a single post with all related data (user, likes, comments).
 */
export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, user: users (id,  name, image), postLikes(*), comments (*, user: users(id, name, image))`
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, referencedTable: "comments" })
      .single();

    if (error) {
      console.log("fetchPostDetails error", error);
      return { success: false, msg: "could not fetch the post" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("fetchPostDetails error", error);
    return { success: false, msg: "could not fetch the post" };
  }
};

/**
 * Likes a post by inserting a row in the postLikes table.
 */
export const createPostLike = async (postLike) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("postLike error", error);
      return { success: false, msg: "could not like the post" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("postLike error", error);
    return { success: false, msg: "could not like the post" };
  }
};

/**
 * Creates a comment associated with a post.
 */
export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log("createComment error", error);
      return { success: false, msg: "could not create your Comment" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("createComment error", error);
    return { success: false, msg: "could not create your Comment" };
  }
};

/**
 * Creates a reply associated with a comment.
 */
export const createCommentReply = async (reply) => {
  try {
    const { data, error } = await supabase
      .from("comment_replies")
      .insert(reply)
      .select()
      .single();

    if (error) {
      console.log("createCommentReply error", error);
      return { success: false, msg: "could not create your Comment Reply" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("createCommentReply error", error);
    return { success: false, msg: "could not create your Comment Reply" };
  }
};

/**
 * Fetches a single comment with all related data (user, comment replies ...).
 */
export const fetchCommentDetails = async (commentId) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `*, user: users (id,  name, image), comment_replies (*, user: users(id, name, image))`
      )
      .eq("id", commentId)
      .order("created_at", {
        ascending: true,
        referencedTable: "comment_replies",
      })
      .single();

    if (error) {
      console.log("fetchCommentDetails error", error);
      return { success: false, msg: "could not fetch the Comment" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("fetchCommentDetails error", error);
    return { success: false, msg: "could not fetch the Comment" };
  }
};

/**
 * Removes a like from a post for a specific user.
 */
export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("postLike error", error);
      return { success: false, msg: "could not remove the post like" };
    }

    return { success: true };
  } catch (error) {
    console.log("postLike error", error);
    return { success: false, msg: "could not remove the post like" };
  }
};

/**
 * Deletes a comment by its ID.
 */
export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("removeComment error", error);
      return { success: false, msg: "could not remove the comment" };
    }

    return { success: true, data: { commentId } };
  } catch (error) {
    console.log("removeComment error", error);
    return { success: false, msg: "could not remove the comment" };
  }
};

/**
 * Deletes a post by its ID.
 */
export const removePost = async (postId) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.log("removePost error", error);
      return { success: false, msg: "could not remove the post" };
    }

    return { success: true, data: { postId } };
  } catch (error) {
    console.log("removePost error", error);
    return { success: false, msg: "could not remove the post" };
  }
};
