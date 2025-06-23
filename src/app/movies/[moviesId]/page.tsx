import MovieDetails from "@/components/movieDetails/MovieDetails"; 
import { use } from "react";

// Fetch movie data and define metadata
export async function generateMetadata() {
    return {
        title: "Movie Details",
    };
}

export default function Page({ params, searchParams }: { 
  params: Promise<{ moviesId: string }>, 
  searchParams: Promise<{ StaticOrAPI: string }>
}) {
    const { moviesId } = use(params);
    const { StaticOrAPI } = use(searchParams);

    return <MovieDetails moviesId={moviesId} StaticOrAPI={StaticOrAPI} />;
}