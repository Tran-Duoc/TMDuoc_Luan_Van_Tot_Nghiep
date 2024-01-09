import { Network, BookOpenCheck, Book } from "lucide-react";

export const ASIDE_ITEMS = [
  {
    name: "Documentation",
    pathname: "/",
    icon: <Book className="h-4 w-4" />,
  },
  {
    name: "KNN",
    pathname: "/knn-predict",
    icon: <BookOpenCheck className="h-4 w-4" />,
  },
  {
    name: "Decision Tree",
    pathname: "/decision-tree-predict",
    icon: <Network className="h-4 w-4" />,
  },
];
