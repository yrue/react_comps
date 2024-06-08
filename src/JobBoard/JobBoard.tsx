import { useEffect, useState } from 'react';

// TODO:
// Improvement
// on load button click -> call API to fetch event based on current job size + 1
// so that no need `page` state and useEffect

interface Job {
  id: string, title: string, time: string, by: string, url?: string
}
const JobPosting = ({ title, by, time, url }: Omit<Job, 'id'>) => {
  return (
    <>
      {url ? <a href={url}>{title}</a> : <div>{title}</div>}
      <>
        By {by}
      </>
      {time}
    </>
  )
}

const PAGE_SIZE = 6;

const JobBoard = () => {
  // api call : stories -{id}-> detail(title, poster, date, link?)
  // 1. fetch stories
  // 2. fetch id
  const [fetchingJobDetails, setFetchingJobDetails] =
    useState(false);
  const [jobIds, setJobIds] = useState<string[] | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  async function fetchJobIds(currPage: number) {
    let jobs = jobIds;
    if (!jobs) {
      const res = await fetch(
        'https://hacker-news.firebaseio.com/v0/jobstories.json',
      );
      jobs = await res.json();
      setJobIds(jobs);
    }

    const start = currPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return jobs.slice(start, end) as string[];
  }

  async function fetchJobs(currPage: number) {
    const jobIdsForPage = await fetchJobIds(currPage);

    setFetchingJobDetails(true);
    const jobsForPage = await Promise.all(
      jobIdsForPage.map((jobId) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`,
        ).then((res) => res.json()),
      ),
    );
    setJobs([...jobs, ...jobsForPage]);

    setFetchingJobDetails(false);
  }


  // fetch 6 poster by default

  // click button to load 6 more list
  // hide button if no more job

  // render job with title, poster(by), time, link?
  return (
    <div>
      <h1>Hacker News Jobs Board</h1>
      {jobIds == null ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {jobs.map((job) => (
              <li key={job.id}>
                <JobPosting  {...job} />
              </li>
            ))}
          </ul>
          {jobs.length > 0 &&
            page * PAGE_SIZE + PAGE_SIZE <
            jobIds.length && (
              <button
                className="load-more-button"
                disabled={fetchingJobDetails}
                onClick={() => setPage(page + 1)}>
                {fetchingJobDetails
                  ? 'Loading...'
                  : 'Load more jobs'}
              </button>
            )}
        </>

      )}
    </div>
  );
};

export default JobBoard;
