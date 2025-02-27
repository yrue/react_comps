import { useEffect, useState, useRef } from 'react';
import styles from './JobBoard.module.scss';

type JobIds = string[]

interface Job {
    id: number;
    title: string;
    by: string;
    time: number;
    url?: string;
}


// in other files
const Job: React.FC<Pick<Job, 'title' | 'by' | 'time'> & Partial<Pick<Job, 'url'>>> = ({ title, by, time, url }) => {
    const formattedDate = new Date(time * 1000).toISOString()
    return (
        <article className={styles.job}>
            {/* TODO: extract as a comp? */}
            {url ? <a href={url} className={styles.title}>{title}</a> : <div className={styles.title}>{title}</div>}
            {/* TODO: does it make sense to call it footer? */}
            <footer className={styles.footer}>
                <div>By <span className={styles.poster}>{by}</span></div>
                <div>{formattedDate}</div>
            </footer>
        </article>
    )
}
const JobList: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
    return (
        <div className={styles.jobList}>
            {jobs.map(job => <Job key={job.id} {...job} />)}
        </div>
    )
}

// api services
const jobApiService = async (url: string) => {
    try {
        const resp = await fetch(url, {
            method: 'GET',  // or 'POST', 'PUT', etc.
            headers: {
                'Content-Type': 'application/json',  // Define the content type
                'Cache-Control': 'max-age=86400',    // Cache for 1 day (86400 seconds)
                'Accept': 'application/json'         // Specify accepted response format
            }
        })
        return resp.json()
    } catch (error) {
        console.error('Error fetching job ids:', error);
    }
}

const GET_JOB_API = `https://hacker-news.firebaseio.com/v0/item/{id}.json`; // TS string formatting?
const GET_JOBS_API = `https://hacker-news.firebaseio.com/v0/jobstories.json`
const LOAD_BATCH_SIZE = 6

const JobBoard = () => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [page, setPage] = useState<number>(0)
    const [jobIds, setJobIds] = useState<JobIds>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isMounted = useRef(true);


    const loadBatchJobs = async (jobIds: JobIds) => {
        setIsLoading(true);
        const promises = []
        let index = page * LOAD_BATCH_SIZE;
        const end = index + LOAD_BATCH_SIZE;
        for (index; index < end; index++) {
            if (index == jobIds.length) {
                break;
            }
            promises.push(jobApiService(GET_JOB_API.replace('{id}', jobIds[index])))
        }
        const curr = await Promise.all(promises);
        if (!isMounted.current) return;
        setPage(prev => prev + 1)
        setJobs(prev => [...prev, ...curr])
        setIsLoading(false);
    }

    // load job ids and initial job when initializing
    useEffect(() => {
        isMounted.current = true;

        (async function () {
            const ids = await jobApiService(GET_JOBS_API)
            if (!ids) return;

            if (!isMounted.current) return;

            await loadBatchJobs(ids);
            setJobIds(ids);
        })();

        // Indicate that the component is unmounted, so
        // that requests that complete after the component
        // is unmounted don't cause a "setState on an unmounted
        // component error".
        return () => {
            isMounted.current = false;
        }
    }, [])

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Hacker News Job Board</h1>
            {jobs.length > 0 && <JobList jobs={jobs} />}
            {isLoading ? <div>Loading...</div> : (
                <button className={styles.btn} disabled={jobs.length === jobIds.length} onClick={() => {
                    loadBatchJobs(jobIds)
                }}>Load more jobs</button>
            )}
        </div>
    );
};

export default JobBoard;
