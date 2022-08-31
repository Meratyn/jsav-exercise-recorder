#!/usr/bin/python3

import base64
import zlib

compressed = 'eJwrLkjMVSgmSAAAINoOaQ=='

decompressed = zlib.decompress(base64.b64decode(compressed))
print("Decompressed: {}".format(decompressed))
