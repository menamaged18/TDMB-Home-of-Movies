import MovieDetails from "@/components/movieDetails/MovieDetails"; // Import the Client Component
import { use } from "react";

// Fetch movie data (if needed) and define metadata
export async function generateMetadata() {
    return {
        title: "Movie Details",
    };
}

export default function Page({ params }: { params: Promise<{ moviesId: string }> }) {
    const { moviesId } = use(params);
    return <MovieDetails moviesId={moviesId} />;
}