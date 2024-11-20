
# #!/bin/bash

sleep 2
# Kill any process using port 5800
if fuser 5800/tcp >/dev/null 2>&1; then
    echo "Killing process on port 5800."
    fuser -k 5800/tcp
fi

# Kill any process using port 5000
if fuser 5000/tcp >/dev/null 2>&1; then
    echo "Killing process on port 5000."
    fuser -k 5000/tcp
fi



# /home/lincode_adm/Dokumente/Magna_Cross_joint_Inspection/edge_v2.4.0(FE+BE)/magna/bin/python3 "/home/lincode_adm/Dokumente/Magna_Cross_joint_Inspection/edge_v2.4.0(FE+BE)/edge_v2.5.0_git/upasak_v2.py"
cd /home/mpt/Documents/edge_v2_5_0/livis_edge_backend/
source /home/mpt/Documents/Magna_Forging/livis/bin/activate
python3 upasak_v2.py
