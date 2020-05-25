#[derive(Clone)]
pub struct Plugin {
    name: Option<String>,
    version: Option<String>,
    /// (type, filename)
    hooks: Vec<(HookType, String)>,
    /// (filename, contents)
    files: Vec<(String, String)>,
}

impl Plugin {
    fn empty() -> Plugin {
        Plugin {
            name: None,
            version: None,
            hooks: vec![],
            files: vec![],
        }
    }
    pub fn get_name(self) -> String {
        return self.name.clone().unwrap();
    }
    pub fn get_version(self) -> String {
        return self.version.clone().unwrap();
    }
    pub fn get_hooks(self) -> Vec<(HookType, String)> {
        return self.hooks.clone();
    }
    pub fn get_files(self) -> Vec<(String, String)> {
        return self.files.clone();
    }
}

pub struct PluginConstructor {
    plug: Plugin
}

impl PluginConstructor {
    pub fn construct() -> PluginConstructor {
        PluginConstructor {
            plug: Plugin::empty()
        }
    }
    pub fn with_name(&mut self, name: String) {
        self.plug.name = Some(name);
    }
    pub fn with_version(&mut self, version: String) {
        self.plug.version = Some(version);
    }
    pub fn with_hook(&mut self, hook_type: String, hook_name: String) {
        self.plug.hooks.push((HookType::from_string(hook_type), hook_name))
    }
    pub fn with_file(&mut self, file_name: String, file_contents: String) {
        self.plug.files.push((file_name, file_contents));
    }
    pub fn build(self) -> Plugin {
        if self.plug.name == None || self.plug.name == Some(String::from("NONAME")) {
            panic!("Plugin found with no name field.");
        }
        if self.plug.version == None || self.plug.version == Some(String::from("NOVERSION")) {
            println!("WARNING: Plugin {} has no version field.", self.plug.name.clone().unwrap());
        }
        if self.plug.hooks.len() == 0 {
            println!("WARNING: Plugin {} has no hooks.", self.plug.name.clone().unwrap());
        }
        if self.plug.files.len() == 0 {
            println!("WARNING: Plugin {} has no files.", self.plug.name.clone().unwrap());
        }
        println!("Plugin `{}` loaded.", self.plug.name.clone().unwrap());
        return self.plug;
    }
}

#[derive(Clone)]
pub enum HookType {
    OnLoad,
    OnCall,
    Base
}

impl HookType {
    fn from_string(string: String) -> HookType {
        match string.to_lowercase().as_ref() {
            "onload" => HookType::OnLoad,
            "oncall" => HookType::OnCall,
            "base" => HookType::Base,
            other => panic!("Unkown hook type {} while loading plugin.", other)
        }
    }
    pub fn to_string(self) -> String {
        match self {
            HookType::OnLoad => String::from("onload"),
            HookType::OnCall => String::from("oncall"),
            HookType::Base => String::from("base"),
        }
    }
}
