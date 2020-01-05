/// Decodes a raw Stream into Packets
pub mod decode;
/// Encodes Packets into a raw Stream
pub mod encode;
/// Describes a stream of semi-parsed data from a connection
pub mod stream;
/// Protocols for connecting to a robot. Being rewritten
/// with WebSocket on client-side soon, please ignore
pub mod roboconnect;
/// Describes pieces of information from the network
pub mod packet;

pub use self::stream::Stream;
