package edu.ucdavis.watershed;

import java.io.File;
import java.util.LinkedList;
import java.util.List;

public class Walker {

	public List<NodeCosts> go(String dir) throws Exception {
		LinkedList<NodeCosts> files = new LinkedList<NodeCosts>();
		
		File root = new File(dir);
		if( !root.exists() || !root.isDirectory() ) {
			throw new Exception("Invalid directory provided");
		}
		
		_walk(root, files);
		return files;
	}
	
	private void _walk(File root, LinkedList<NodeCosts> files) {
		String[] children = root.list();
		File f;
		
		for( int i = 0; i < children.length; i++ ) {
			f = new File(root.getAbsolutePath()+File.separator+children[i]);
			
			if( !f.isDirectory() ) continue;
			
			if( f.getName().toLowerCase().equals("costs") ) {
				NodeCosts nodeCosts = new NodeCosts(root.getName(), root.getAbsolutePath());
				nodeCosts.files = f.list();
				files.push(nodeCosts);
				
				return;
			}
			
			_walk(f, files);
		}
	}
	
}
