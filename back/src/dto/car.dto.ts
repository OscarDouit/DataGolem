export interface CarDto {
    id: number;
    make: string;
    model: string;
    year: string;
    category: string;
    drive: string;
    transmission: string;
    cylinders: string;
    consumption: string;
    fuel: string;
    likes: number;
    dislikes: number;
    userVote?: 'like' | 'dislike' | null;    
}