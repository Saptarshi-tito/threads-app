"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder, model } from "mongoose";

// creating a new function to update the user

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name: username.toLowerCase(),
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
      // upsert = update and inserting/ database operation
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
    // revalidatePath -> updating cache data without letting validation to expire
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model: Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    //TODO: Populate Communities

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "Children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortby = 'desc'
} : {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortby?: SortOrder;
}){
  try {
    connectToDB();


    // SKIPPING
    const skipAmount = (pageNumber - 1) * pageSize;

    // case insensitive for searching User -> below

    const regex = new RegExp(searchString, "i");
    // i = case insensitive, regex = regular expression


    // FETCHING
    // creating initial query to get the users
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId}    // ne = not equal to
    }
    // above we are filtering out our current user

    // SEARCHING
    // check if searchString exists(below)
    if(searchString.trim() !== ''){
      query.$or = [
        { username: { $regex: regex }},  // searching for username that then looks into $regex=regex, which we created before
        { name: { $regex: regex} }
      ]
    }


    // SORTING
    const sortOptions = { createdAt: sortby };

    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // find all the threads created by the user
    const userThreads = await Thread.find({ author: userId })

    // collect all child thread ids (replies) from the 'children' field
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.Children)
    }, [])

    // get all replies EXCEPT the one created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds},
      author: {$ne: userId}
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    })

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}