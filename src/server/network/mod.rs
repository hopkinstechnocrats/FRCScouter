/// Decodes a raw Stream into Packets
pub mod decode;
/// Encodes Packets into a raw Stream
pub mod encode;
/// Describes a stream of semi-parsed data from a connection
pub mod stream;
/// Describes pieces of information from the network
pub mod packet;

pub use self::stream::Stream;
