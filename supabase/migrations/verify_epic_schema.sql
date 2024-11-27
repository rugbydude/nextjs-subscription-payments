-- verify_epic_schema.sql
DO $$ 
BEGIN
    -- Check epics table
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'epics'
    ) THEN
        RAISE EXCEPTION 'Epics table does not exist';
    END IF;

    -- Verify columns
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'epics'
        AND column_name IN (
            'id', 'title', 'description', 'status', 
            'priority', 'project_id', 'user_id',
            'start_date', 'end_date', 
            'created_at', 'updated_at'
        )
    ) THEN
        RAISE EXCEPTION 'Missing required columns in epics table';
    END IF;

    -- Verify foreign keys
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints
        WHERE table_schema = 'public'
        AND table_name = 'epics'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        RAISE EXCEPTION 'Missing foreign key constraints in epics table';
    END IF;

    -- Verify RLS policies
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'epics'
    ) THEN
        RAISE EXCEPTION 'Missing RLS policies for epics table';
    END IF;
END $$;
