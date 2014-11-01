#
# The Alphanum Algorithm is an improved sorting algorithm for strings
# containing numbers.  Instead of sorting numbers in ASCII order like
# a standard sort, this algorithm sorts numbers in numeric order.
#
# The Alphanum Algorithm is discussed at http://www.DaveKoelle.com
#
#* Python implementation provided by Chris Hulan (chris.hulan@gmail.com)
#* Distributed under same license as original
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or any later version.
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
#

import re

#
# TODO: Make decimal points be considered in the same class as digits
#

def chunkify(str):
	"""return a list of numbers and non-numeric substrings of +str+

	the numeric substrings are converted to integer, non-numeric are left as is
	"""
	chunks = re.findall("(\d+|\D+)",str)
	chunks = [re.match('\d',x) and int(x) or x for x in chunks] #convert numeric strings to numbers
	return chunks

def alphanum(a,b):
	"""breaks +a+ and +b+ into pieces and returns left-to-right comparison of the pieces

	+a+ and +b+ are expected to be strings (for example file names) with numbers and non-numeric characters
	Split the values into list of numbers and non numeric sub-strings and so comparison of numbers gives
	Numeric sorting, comparison of non-numeric gives Lexicographic order
	"""
	# split strings into chunks
	aChunks = chunkify(a)
	bChunks = chunkify(b)

	return cmp(aChunks,bChunks) #built in comparison works once data is prepared
