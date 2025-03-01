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
type JobProps = Pick<Job, 'title' | 'by' | 'time'> & { url?: Job['url'] };
const Job: React.FC<JobProps> = ({ title, by, time, url }) => {
    const formattedDate = new Date(time * 1000).toISOString()
    const sharedTitleProps = {
        className: styles.title,
        children: title
    }   
    return (
        <article className={styles.job}>
            {url ? <a href={url} {...sharedTitleProps} /> : <div {...sharedTitleProps} />}
            <footer className={styles.footer}>
                <div>By <span className={styles.poster}>{by}</span></div>
                <div>{formattedDate}</div>
            </footer>
        </article>
    )
}

type JobListProps = { jobs: Job[] }
const JobList: React.FC<JobListProps> = ({ jobs }) => {

    return (
        <div className={styles.jobList}>
            {jobs.map(job => <Job key={job.id} {...job} />)}
            {jobs.length === 0 && <p>No data.</p>}
        </div>
    )
}

const apiService = async (url: string) : Promise<any> => {
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
        // TODO: handle error properly on UI
    }
}
const getJobIds = () => apiService('https://hacker-news.firebaseio.com/v0/jobstories.json')
const getJob = (id: string) => apiService('https://hacker-news.firebaseio.com/v0/item/{id}.json'.replace('{id}', id))

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
            promises.push(getJob(jobIds[index]))
        }
        const curr = await Promise.all(promises);
        if (!isMounted.current) return;
        setPage(prev => prev + 1)
        setJobs(prev => [...prev, ...curr.filter(job => !!job)])
        setIsLoading(false);
    }

    // load job ids and initial job when initializing
    useEffect(() => {
        isMounted.current = true;

        (async function () {
            const ids = await getJobIds();
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
            {!isLoading && <JobList jobs={jobs} />}
            {isLoading ? <div>Loading...</div> : (
                <button className={styles.btn} disabled={jobs.length === jobIds.length} onClick={() => {
                    loadBatchJobs(jobIds)
                }}>Load more jobs</button>
            )}
        </div>
    );
};

export default JobBoard;
