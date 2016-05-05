export class ProjectDetailModel {
    creator: Creator = new Creator();
    dateTimeShared: Date; // datetime_shared
    description: string;
    favoriteCount: number; // favorite_count
    id: number;
    loveCount: number; // love_count
    resourceUri: string; // resource_uri
    thumbnail: string;
    title: string;
    viewCount: number; // view_count

}

export class Creator {
    username: string;
    userprofile: UserProfile = new UserProfile();
}

export class UserProfile {
    bio: string;
    country: string;
    status: string;
}
