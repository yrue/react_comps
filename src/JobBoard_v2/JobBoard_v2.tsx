import { useEffect, useRef, useState } from 'react';
import styles from './JobBoard_v2.module.scss';

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
        console.error(error)
    }
}

const GET_JOB_API = `https://hacker-news.firebaseio.com/v0/item/{id}.json`; // TS string formatting?
const GET_JOBS_API = `https://hacker-news.firebaseio.com/v0/jobstories.json`
const LOAD_BATCH_SIZE = 6

const JobBoard_v2 = () => {
    const [jobs, setJobs] = useState<Job[]>([])
    const nextIndexRef = useRef(0) // should be state?
    const jobIdsRef = useRef<JobIds>([])

    const loadBatchJobs = async (jobIds: JobIds) => {
        const promises = []
        let index;
        for (index = nextIndexRef.current; index < nextIndexRef.current + LOAD_BATCH_SIZE; index++) {
            if (index == jobIds.length) {
                break;
            }
            promises.push(await jobApiService(GET_JOB_API.replace('{id}', jobIds[index])))
        }
        const result = await Promise.all(promises);
        nextIndexRef.current += 6
        setJobs(prev => prev.concat(result))
    }

    // load job ids and initial job when initializing
    useEffect(() => {
        (async function () {
            const jobIds = await jobApiService(GET_JOBS_API)
            jobIdsRef.current = jobIds;

            await loadBatchJobs(jobIds);
        })();
    }, [])

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Hacker News Job Board</h1>
            <JobList jobs={jobs} />
            <button className={styles.btn} disabled={jobs.length === jobIdsRef.current.length} onClick={async () => {
                await loadBatchJobs(jobIdsRef.current)
            }}>Load more jobs</button>
        </div>
    );
};

export default JobBoard_v2;
