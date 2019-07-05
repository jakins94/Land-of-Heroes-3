@echo off
cmd /c "cd c:/mongodb/bin & mongod --setParameter enableLocalhostAuthBypass=false"
pause