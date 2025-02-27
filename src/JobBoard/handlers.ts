import { http, HttpResponse } from 'msw'

const MOCKED_POST_COUNT = 13

function getRandomTimestamp(startDate: Date = new Date('2020-01-01T00:00:00Z'), endDate: Date = new Date()): number {
    const startTimestamp = startDate.getTime()
    const endTimestamp = endDate.getTime()
    return (Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp) / 1000
}

interface Job {
    id: number
    title: string
    by: string
    time: number
    url?: string
}

const jobs: Record<string, Job> = {}

for (let i = 1; i <= MOCKED_POST_COUNT; i++) {
    jobs[i.toString()] = {
        id: i,
        title: `Job ${i}`,
        by: `User ${i}`,
        time: getRandomTimestamp(),
        url: i === 3 ? 'http://example.com' : undefined
    }
}

export const handlers = [
    http.get('https://hacker-news.firebaseio.com/v0/jobstories.json', () => {
        return HttpResponse.json(Object.keys(jobs))
    }),
    http.get('https://hacker-news.firebaseio.com/v0/item/:id.json', ({ params }) => {
        const id = params.id as string
        return HttpResponse.json(jobs[id])
    })
]