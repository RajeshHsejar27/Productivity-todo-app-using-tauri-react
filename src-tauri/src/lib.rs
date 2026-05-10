// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        tauri_plugin_sql::Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                color TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                due_date DATETIME,
                priority TEXT DEFAULT 'medium',
                status TEXT DEFAULT 'pending',
                category_id TEXT,
                is_pinned BOOLEAN DEFAULT 0,
                completed_at DATETIME,
                sort_order INTEGER DEFAULT 0,
                reminder_enabled BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            ",
            kind: tauri_plugin_sql::MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:todotracker.db", migrations).build())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
