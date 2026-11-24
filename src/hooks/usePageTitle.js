import { useEffect } from "react";

const DEFAULT_TITLE = "taskOra — Plan clearly. Get things done.";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · taskOra` : DEFAULT_TITLE;
  }, [title]);
}
