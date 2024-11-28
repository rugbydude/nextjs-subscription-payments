import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // Adjust the import based on your project structure

interface Project {
    title: string;
}

interface Epic {
    project_id: string;
    projects?: Project[];
    created_at: string;
    status: 'todo' | 'in_progress' | 'done'; // Adjust as necessary
}

const EpicsList: React.FC = () => {
    const [epics, setEpics] = useState<Epic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<Epic['status'] | 'all'>('all');
    const supabase = createClientComponentClient();

    const fetchEpics = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("epics")
                .select(`
                    *,
                    projects (
                        title
                    )
                `);
            
            if (error) throw error;

            setEpics(data || []);
        } catch (error) {
            console.error("Error fetching epics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEpics();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const filteredEpics = filter === 'all' ? epics : epics.filter(epic => epic.status === filter);

    return (
        <div>
            <h1>Epics List</h1>
            <select onChange={(e) => setFilter(e.target.value as Epic['status'] | 'all')}>
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
            </select>
            <ul>
                {filteredEpics.map(epic => (
                    <li key={epic.project_id}>
                        <h2>{epic.projects?.[0]?.title || 'Untitled'}</h2>
                        <p>Created at: {new Date(epic.created_at).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EpicsList;
